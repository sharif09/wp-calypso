/**
 * External dependencies
 */
import React from 'react';

const ActionButtonContainer = ( { children } ) =>
	children ? <div className="importer__action-button-container">{ children }</div> : null;

ActionButtonContainer.displayName = 'ActionButtonContainer';

export default ActionButtonContainer;
