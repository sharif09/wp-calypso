/** @format */
/**
 * Internal dependencies
 */
import { RECOMMENDED_PLUGINS_REQUEST, RECOMMENDED_PLUGINS_RECEIVE } from 'state/action-types';

/**
 * Returns an action object that's bound to the data layer;
 * fetches a list of recommended plugins for the given siteId.
 *
 * @param  {Number}  siteId        Site ID
 * @param  {Number}  limit         Number of desired plugin recommendations
 * @return {Object}  Action object
 */
export function fetchRecommendedPlugins( siteId, limit = 6 ) {
	return {
		limit,
		siteId,
		type: RECOMMENDED_PLUGINS_REQUEST,
	};
}

/**
 * Returns an action object to signal that a list of recommended plugins
 * has been received.
 *
 * @param  {Number}  siteId         Site ID
 * @param  {Array<Object>}  data    List of recommended plugins
 * @return {Object}  Action object
 */
export function receiveRecommendedPlugins( siteId, data ) {
	return {
		data,
		siteId,
		type: RECOMMENDED_PLUGINS_RECEIVE,
	};
}