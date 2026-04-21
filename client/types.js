/**
 * @typedef {Object} JobRole
 * @property {string} title
 * @property {string} description
 * @property {string[]} skills
 */

/**
 * @typedef {Object} JobDomain
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} skills
 * @property {JobRole[]} roles
 * @property {number[]} [relatedDomainIds]
 */

/**
 * @typedef {Object} FeaturePoint
 * @property {string} title
 * @property {string} [description]
 * @property {import('react').ReactNode} [icon]
 */

/**
 * @typedef {Object} Step
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} [details]
 */

export const Types = {};