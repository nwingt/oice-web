import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { push } from 'react-router-redux';
import classNames from 'classnames';

import _get from 'lodash/get';

import FlatButton from 'ui-elements/FlatButton';
import LinkTooltip from 'ui-elements/LinkTooltip';
import OutlineButton from 'ui-elements/OutlineButton';

import InteractiveTutorial from 'editor/components/InteractiveTutorial';

import Throttle from 'ui-elements/Throttle';

import AddIcon from 'common/icons/add';
import CloseIcon from 'common/icons/close-bold';
import PlayIcon from 'common/icons/play';
import SettingIcon from 'common/icons/setting';

import './styles.scss';

@translate(['StoryDashboard', 'Language'])
@connect()
export default class StoryDetails extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    oices: PropTypes.array,
    story: PropTypes.object,
    onAddOice: PropTypes.func,
    onOpenStorySettingModal: PropTypes.func,
    onRequestClose: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedOiceIndex: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (_get(nextProps, 'story.id') !== _get(this.props, 'story.id')) {
      this.setState({ selectedOiceIndex: undefined });
    }
  }

  handleCloseButtonClick = () => {
    const { onRequestClose } = this.props;
    if (onRequestClose) onRequestClose();
  }

  handleOnClickStorySettingButton = () => {
    const { onOpenStorySettingModal } = this.props;
    if (onOpenStorySettingModal) onOpenStorySettingModal();
  }

  handleOnClickOiceRow = ({ target }, index) => {
    if (target.className.includes('button')) return;
    const { selectedOiceIndex } = this.state;
    if (selectedOiceIndex !== index) {
      this.setState({ selectedOiceIndex: index });
    }
  }

  handleOnClickEditOiceButton = ({ storyId, id }) => {
    this.props.dispatch(InteractiveTutorial.Action.achieve(['115c8cf']));
    this.props.dispatch(push(`story/${storyId}/oice/${id}`));
  }

  handleClickPlayPublishOiceButton = (url) => {
    window.open(url, '_blank');
  }

  handleClickAddOiceButton = () => {
    const { onAddOice } = this.props;
    if (onAddOice) onAddOice();
  }

  renderOiceRows(props) {
    const { t, oices } = this.props;
    const { selectedOiceIndex } = this.state;
    return (
      <div className="oice-rows">
        {oices.map((oice, index) => {
          const publishDisable = oice.hasPublished ? '' : ' disabled';
          const selected = (index === selectedOiceIndex) ? ' selected' : '';
          return (
            <div
              key={`oice-row-${oice.id}`}
              className={`oice-row${selected}`}
              onClick={e => this.handleOnClickOiceRow(e, index)}
            >
              <div className="left-details">
                <span>{index + 1}</span>
                <div className={`oice-status${publishDisable}`} />
                <span>{oice.name}</span>
              </div>
              <div className="right-button-group">
                <div
                  className="edit-oice-button"
                  onClick={() => this.handleOnClickEditOiceButton(oice)}
                >
                  <OutlineButton
                    color="red"
                    label={t('label.button.edit')}
                    width={88}
                  />
                </div>
                <div
                  className={classNames('play-oice-button', {
                    disabled: !oice.hasPublished,
                  })}
                  onClick={() => this.handleClickPlayPublishOiceButton(oice.shareUrl)}
                >
                  <div className="play-oice-icon" />
                </div>
                <LinkTooltip
                  className={classNames({
                    disabled: !oice.hasPublished,
                  })}
                  float={false}
                  link={oice.shareUrl}
                />
              </div>
            </div>
          );
        })}
        <Throttle>
          {throttle => (
            <div
              className="oice-row add"
              onClick={throttle(this.handleClickAddOiceButton)}
            >
              <AddIcon />
              <span>{t('label.button.addOice')}</span>
            </div>
          )}
        </Throttle>
      </div>
    );
  }

  render() {
    const { t, oices, story } = this.props;
    const { hoverOiceIndex, selectedOiceIndex } = this.state;
    // show hovered oice => selected oice => default first oice
    const selectedOice = oices[hoverOiceIndex] || oices[selectedOiceIndex] || oices[0];
    let description = _get(selectedOice, 'description', '');
    if (description.length > 18) {
      description = `${description.substring(0, 18)} ...`;
    }
    const backgroundImage = selectedOice ?
      `url("${_get(selectedOice, 'image.origin', '/static/img/oice-default-cover2.jpg')}")` : '';
    return (
      <div className="story-details-wrapper">
        <div className="story-info">
          <div className="story-name">
            <h1>{_get(story, 'name')}</h1>
            <FlatButton
              icon={<SettingIcon />}
              onClick={this.handleOnClickStorySettingButton}
            />
          </div>
          <div className="story-language">
            {t(_get(story, 'language'))}
          </div>
        </div>
        <div className="story-details">
          {this.renderOiceRows()}
        </div>
        <div
          className="close-icon"
          onClick={this.handleCloseButtonClick}
        >
          <CloseIcon />
        </div>
      </div>
    );
  }
}
