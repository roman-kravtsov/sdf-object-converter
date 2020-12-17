const Converter = require("../Converter/Converter");
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
    });
    this.sdfObject = SDFObject;
    const rootObjectKey = Object.keys(this.sdfObject.sdfObject)[0];
    this.rootObject = this.sdfObject.sdfObject[rootObjectKey];
  }

  __isRequired(propertyName) {
    for (const requiredObject of this.rootObject.sdfRequired) {
      if (requiredObject.indexOf(propertyName) !== -1) {
        return true;
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
   *
   *
   * @param {*} sdfObject
   * @param {*} objectName
   * @param {*} dataName
   */
  __getSDFObjectData(objectName, dataName) {
    return this.sdfObject.sdfObject[objectName].sdfData[dataName];
  }

  /**
   * Get a referenced sdfData
   *
   * @param {Object} sdfObject
   * @param {String} ref
   */
  __getSDFObjectRef(objectName, ref) {
    const dataName = ref.match(/\w+$/)[0];
    return this.__getSDFObjectData(objectName, dataName);
  }

  /**
   * Map properties of an sdfObject to the properties of the Thing Model
   *
   */
  mapProperties() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.sdfObject.sdfObject[key].sdfProperty) {
      const sdfProperty = this.__getSDFObjectProperty(key, property);
      let thingModelProperty = this.__generateThingProperty(
        property,
        sdfProperty.type
      );
      thingModelProperty.readOnly = !sdfProperty.writable;
      // thingModelProperty.forms = this.__generateThingModelForms(
      //   thingModelProperty.forms[0].href
      // );
      thingModelProperty.required = this.__isRequired(property);
      this.targetModel.properties[property] = thingModelProperty;
    }
  }

  /**
   * Map actions of a sdfObject to the actions of the Thing Model
   *
   */
  mapActions() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.sdfObject.sdfObject[key].sdfAction) {
      const sdfAction = this.__getSDFObjectAction(key, property);
      let thingModelAction = this.__generateThingAction(property);
      for (let inputObjectKey in sdfAction.sdfData) {
        if (sdfAction.sdfData[inputObjectKey].sdfRef) {
          thingModelAction.input = this.__getSDFObjectRef(
            key,
            sdfAction.sdfData[inputObjectKey].sdfRef
          );
        }
      }

      // thingModelAction.forms = this.__generateThingModelForms(
      //   thingModelAction.forms[0].href
      // );
      thingModelAction.required = this.__isRequired(property);
      this.targetModel.actions[property] = thingModelAction;
    }
  }

  /**
   * Map events of a sdfObject to the events of the Thing Model
   *
   */
  mapEvents() {
    const key = Object.keys(this.sdfObject.sdfObject)[0];
    for (let property in this.sdfObject.sdfObject[key].sdfEvent) {
      const sdfEvent = this.__getSDFObjectEvent(key, property);
      let thingModelEvent = this.__generateThingEvent(property);

      for (let inputObjectKey in sdfEvent.sdfOutputData) {
        if (sdfEvent.sdfOutputData[inputObjectKey].sdfRef) {
          thingModelEvent.data = this.__getSDFObjectRef(
            key,
            sdfEvent.sdfOutputData[inputObjectKey].sdfRef
          );
        }
      }

      // thingModelEvent.forms = this.__generateThingModelForms(
      //   thingModelEvent.forms[0].href
      // );
      thingModelEvent.required = this.__isRequired(property);
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
    this.targetModel["@context"] = ["https://www.w3.org/2019/wot/td/v1"];
    this.targetModel["@type"] = "Thing";
    this.targetModel.title = this.sdfObject.info.title;
    this.mapProperties();
    this.mapActions();
    this.mapEvents();
    return this.targetModel;
  }
}
module.exports = SDFObjectConverter;
