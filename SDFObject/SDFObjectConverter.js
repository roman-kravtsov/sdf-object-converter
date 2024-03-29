const Converter = require("../Converter/Converter");
const _ = require("lodash");
/**
 * A SDFObject Model
 * @typedef {Object} SDFObjectModel
 */

/**
 * A Converter from SDFObject to Thing Model
 * Refer to https://ietf-wg-asdf.github.io/SDF/sdf.html for SDF Object documentation
 * @class SDFObjectConverter
 * @extends {Converter}
 */
class SDFObjectConverter extends Converter {
  constructor(SDFObject) {
    super({
      properties: {},
      actions: {},
      events: {},
      "tm:required": [],
    });
    this.sdfObject = SDFObject;
  }

  __getRootObject() {
    const rootObjectKey = Object.keys(this.sdfObject.sdfObject)[0];
    return this.sdfObject.sdfObject[rootObjectKey];
  }

  __isRequired(propertyName) {
    if (
      this.__getRootObject().sdfRequired &&
      this.__getRootObject().sdfRequired.length > 0
    ) {
      for (const requiredObject of this.__getRootObject().sdfRequired) {
        if (requiredObject.indexOf(propertyName) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get SDFObject property
   *
   * @param {*} sdfObject
   * @param {*} objectName
   * @param {*} propertyName
   * @returns
   */
  __getSDFObjectProperty(objectName, propertyName) {
    return this.sdfObject["sdfObject"][objectName]["sdfProperty"][propertyName];
  }

  /**
   * Get SDFObject action
   *
   * @param {*} sdfObject
   * @param {*} objectName
   * @param {*} propertyName
   * @returns
   */
  __getSDFObjectAction(objectName, propertyName) {
    return this.sdfObject["sdfObject"][objectName]["sdfAction"][propertyName];
  }

  /**
   * Get SDFObject event
   *
   * @param {*} sdfObject
   * @param {*} objectName
   * @param {*} propertyName
   * @returns
   */
  __getSDFObjectEvent(objectName, propertyName) {
    return this.sdfObject["sdfObject"][objectName]["sdfEvent"][propertyName];
  }

  /**
   * Get a referenced sdfData
   *
   * @param {Object} sdfObject
   * @param {String} ref
   */
  __getSDFObjectRef(ref) {
    const accessKey = ref.replace("#/", "").split("/").join(".");
    return _.get(this.sdfObject, accessKey);
  }

  /**
   * Map properties of an sdfObject to the properties of the Thing Model
   *
   */
  mapProperties() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.__getRootObject().sdfProperty) {
      const sdfProperty = this.__getSDFObjectProperty(key, property);
      let thingModelProperty;
      if (sdfProperty.sdfRef) {
        const sdfData = this.__getSDFObjectRef(sdfProperty.sdfRef);
        thingModelProperty = this.__generateThingProperty(property, sdfData);
      } else {
        delete sdfProperty.label;
        thingModelProperty = this.__generateThingProperty(
          property,
          sdfProperty
        );
      }
      // thingModelProperty.forms = this.__generateThingModelForms(
      //   thingModelProperty.forms[0].href
      // );
      if (this.__isRequired(property)) {
        // this.targetModel.properties.required.push(property);
        this.targetModel["tm:required"].push(`#/properties/${property}`);
      }
      this.targetModel.properties[property] = thingModelProperty;
    }
  }

  /**
   * Map actions of a sdfObject to the actions of the Thing Model
   *
   */
  mapActions() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.__getRootObject().sdfAction) {
      const sdfAction = this.__getSDFObjectAction(key, property);
      let thingModelAction = this.__generateThingAction(property);
      for (let inputObjectKey in sdfAction.sdfData) {
        if (sdfAction.sdfData[inputObjectKey].sdfRef) {
          thingModelAction.input = this.__getSDFObjectRef(
            sdfAction.sdfData[inputObjectKey].sdfRef
          );
        }
      }

      // thingModelAction.forms = this.__generateThingModelForms(
      //   thingModelAction.forms[0].href
      // );
      if (this.__isRequired(property)) {
        this.targetModel["tm:required"].push(`#/actions/${property}`);
      }
      this.targetModel.actions[property] = thingModelAction;
    }
  }

  /**
   * Map events of a sdfObject to the events of the Thing Model
   *
   */
  mapEvents() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.__getRootObject().sdfEvent) {
      const sdfEvent = this.__getSDFObjectEvent(key, property);
      let thingModelEvent = this.__generateThingEvent(property);

      for (let inputObjectKey in sdfEvent.sdfOutputData) {
        if (sdfEvent.sdfOutputData[inputObjectKey].sdfRef) {
          thingModelEvent.data = this.__getSDFObjectRef(
            sdfEvent.sdfOutputData[inputObjectKey].sdfRef
          );
        }
      }

      // thingModelEvent.forms = this.__generateThingModelForms(
      //   thingModelEvent.forms[0].href
      // );
      if (this.__isRequired(property)) {
        // this.targetModel.events.required.push(property);
        this.targetModel["tm:required"].push(`#/events/${property}`);
      }
      this.targetModel.events[property] = thingModelEvent;
    }
  }

  /**
   * Convert sdfObject to a Thing Model
   * @returns {Object} Thing Model
   */
  convert() {
    const now = new Date(Date.now());
    this.targetModel.created = now;
    this.targetModel.modified = now;
    this.targetModel["@context"] = ["http://www.w3.org/ns/td"];
    this.targetModel["@type"] = "ThingModel";
    this.targetModel.title = this.sdfObject.info.title;
    this.mapProperties();
    this.mapActions();
    this.mapEvents();
    if (this.targetModel["tm:required"].length === 0) {
      delete this.targetModel["tm:required"];
    }
    return this.targetModel;
  }
}
module.exports = SDFObjectConverter;
