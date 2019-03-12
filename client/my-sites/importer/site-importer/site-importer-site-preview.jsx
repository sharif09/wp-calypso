/** @format */
/**
 * External dependencies
 */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Spinner from 'components/spinner';
import ExternalLink from 'components/external-link';
import MiniSitePreview from 'components/mini-site-preview';
import ErrorPane from 'my-sites/importer/error-pane';
import { recordTracksEvent } from 'state/analytics/actions';
import { loadmShotsPreview } from 'my-sites/importer/site-importer/site-preview-actions';
import ImportableContent from 'my-sites/importer/site-importer/site-importer-importable-content';
import ActionButton from 'my-sites/importer/action-buttons/action-button';
import ActionButtonContainer from 'my-sites/importer/action-buttons/container';

class SiteImporterSitePreview extends React.Component {
	static propTypes = {
		siteURL: PropTypes.string.isRequired,
		importData: PropTypes.object,
		isLoading: PropTypes.bool,
		startImport: PropTypes.func,
		resetImport: PropTypes.func,
		site: PropTypes.object,
	};

	state = {
		previewRetries: 0,
		siteURL: this.props.siteURL,
		sitePreviewImage: '',
		sitePreviewFailed: false,
		loadingPreviewImage: true,
	};

	componentDidMount() {
		// TODO: We might want to move this state handling to redux.
		this.loadSitePreview();
	}

	loadSitePreview = () => {
		this.setState( { loadingPreviewImage: true, previewStartTime: Date.now() } );

		loadmShotsPreview( {
			url: this.state.siteURL,
			maxRetries: 30,
			retryTimeout: 1000,
		} )
			.then( imageBlob => {
				this.setState( {
					loadingPreviewImage: false,
					sitePreviewImage: imageBlob,
					sitePreviewFailed: false,
				} );

				this.props.recordTracksEvent( 'calypso_site_importer_site_preview_success', {
					blog_id: this.props.site.ID,
					site_url: this.state.siteURL,
					time_taken_ms: Date.now() - this.state.previewStartTime,
				} );
			} )
			.catch( () => {
				this.setState( {
					loadingPreviewImage: false,
					sitePreviewImage: '',
					sitePreviewFailed: true,
				} );

				this.props.recordTracksEvent( 'calypso_site_importer_site_preview_fail', {
					blog_id: this.props.site.ID,
					site_url: this.state.siteURL,
					time_taken_ms: Date.now() - this.state.previewStartTime,
				} );
			} );
	};

	render = () => {
		const { siteURL } = this.props;
		const isLoading = this.props.isLoading || this.state.loadingPreviewImage;
		const isError = this.state.sitePreviewFailed;

		const containerClass = classNames( 'site-importer__site-preview-overlay-container', {
			isLoading,
		} );

		return (
			<div>
				{ ! isError ? (
					<React.Fragment>
						{ ! isLoading && (
							<React.Fragment>
								<div className="site-importer__site-importer-confirm-site-pane-container">
									<div className="site-importer__site-importer-confirm-site-label">
										{ this.props.translate( 'Is this your site?' ) }
										<div className="site-importer__source-url">
											<ExternalLink href={ siteURL } target="_blank">
												{ siteURL }
											</ExternalLink>
										</div>
									</div>
								</div>
								<div className={ containerClass }>
									<div className="site-importer__site-preview-column-container">
										<MiniSitePreview
											className="site-importer__site-preview"
											imageSrc={ this.state.sitePreviewImage }
										/>
										<ImportableContent importData={ this.props.importData } />
									</div>
								</div>
								<ActionButtonContainer>
									<ActionButton disabled={ isLoading } onClick={ this.props.resetImport }>
										{ this.props.translate( 'Cancel' ) }
									</ActionButton>
									<ActionButton disabled={ isLoading } primary onClick={ this.props.startImport }>
										{ this.props.translate( 'Yes! Start import' ) }
									</ActionButton>
								</ActionButtonContainer>
							</React.Fragment>
						) }
						{ isLoading && (
							<div className="site-importer__site-preview-loading-overlay">
								<Spinner />
							</div>
						) }
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="site-importer__site-preview-error">
							<ErrorPane
								type="importError"
								description={ this.props.translate(
									'Unable to load site preview. Please try again later.'
								) }
							/>
						</div>
						<ActionButtonContainer>
							<ActionButton disabled={ isLoading } onClick={ this.props.resetImport }>
								{ this.props.translate( 'Cancel' ) }
							</ActionButton>
						</ActionButtonContainer>
					</React.Fragment>
				) }
			</div>
		);
	};
}

export default connect(
	null,
	{ recordTracksEvent }
)( localize( SiteImporterSitePreview ) );
