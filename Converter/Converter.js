/**
 * Converter
 *
 * @class Converter
 */
class Converter {
  /**
   * Creates an instance of Converter.
   * @param {ThingModel|ThingDescription} targetModel
   */
  constructor(targetModel) {
    this.targetModel = targetModel;
  }
  /**
   * Map Properties
   *
   * @memberof Converter
   */
  mapProperties() {}
  /**
   *
   *
   * @memberof Converter
   */
  mapActions() {}
  /**
   *
   *
   * @memberof Converter
   */
  mapEvents() {}
  /**
   *
   *
   * @memberof Converter
   */
  convert() {}

  /**
   * Generate a Thing Model Property
   *
   * @param {String} name Property name
   * @param {Object} data Property data
   */
  __generateThingProperty(name, data) {
    return {
      title: name,
      ...data,
    };
  }

  /**
   * Generate a Thing Model Action
   *
   * @param {String} name Action name
   */
  __generateThingAction(name) {
    return {
      title: name,
      input: {},
    };
  }

  /**
   * Generate a Thing Model Event
   *
   * @param {String} name Event name
   */
  __generateThingEvent(name) {
    return {
      title: name,
      input: {},
    };
  }

  /**
   * Generate forms
   *
   * @param {*} base
   * @param {*} href
   * @returns
   */
  __generateThingModelForms(href) {
    return [
      {
        href: `${href}`,
        contentType: "application/json",
      },
    ];
  }
}
module.exports = Converter;
