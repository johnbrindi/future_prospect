/**
 * @typedef {Object} CreateStudentInput
 * @property {string} user_id
 * @property {string} full_name
 * @property {string} [university]
 * @property {string} [department]
 * @property {string} [bio]
 * @property {string} [avatar_url]
 * @property {string[]} [skills]
 * @property {string} [graduation_year]
 * @property {StudentProject[]} [projects]
 */

/**
 * @typedef {Object} StudentProject
 * @property {string} title
 * @property {string} description
 * @property {string} [url]
 */

/**
 * @typedef {string} UUID
 */

/**
 * @typedef {Object} LeafletMapProps
 * @property {Array<{id: string, name: string, lat: number, lng: number, industry?: string}>} [companyLocations]
 * @property {function({id: string, name: string}): void} [onMarkerClick]
 * @property {string} [height]
 * @property {string} [width]
 * @property {[number, number]} [defaultCenter]
 * @property {number} [defaultZoom]
 */

/**
 * @typedef {Object} MessagingSystemProps
 * @property {function(): void} [onClose]
 */

/**
 * @typedef {Object} ProfileEditorProps
 * @property {function(): void} [onClose]
 * @property {any} [profileData]
 * @property {function(updatedProfile: any): void} [onUpdate]
 */

/**
 * @typedef {Object} InternshipSearchResult
 * @property {number} id
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {string} type
 * @property {string} postedDate
 * @property {string} logoColor
 * @property {number} lat
 * @property {number} lng
 * @property {string} [description]
 */

/**
 * @typedef {Object} ApplicationResult
 * @property {number} id
 * @property {string} title
 * @property {string} company
 * @property {string} status
 * @property {string} date
 * @property {string} logoColor
 */

// Export the types for documentation purposes
export const Types = {
  CreateStudentInput: /** @type {CreateStudentInput} */ ({}),
  StudentProject: /** @type {StudentProject} */ ({}),
  UUID: /** @type {UUID} */ (''),
  LeafletMapProps: /** @type {LeafletMapProps} */ ({}),
  MessagingSystemProps: /** @type {MessagingSystemProps} */ ({}),
  ProfileEditorProps: /** @type {ProfileEditorProps} */ ({}),
  InternshipSearchResult: /** @type {InternshipSearchResult} */ ({}),
  ApplicationResult: /** @type {ApplicationResult} */ ({})
};