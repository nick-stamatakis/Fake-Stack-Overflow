import React from 'react';
import { validEditTags } from '../Util.js';
import { model, USER_PROFILE_PAGE } from '../globals.js';

export default class EditTagPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleEditTagClick = this.handleEditTagClick.bind(this);
    }

    async handleEditTagClick() {
        const tagsTA = document.getElementById('ask-question-tags');
        const isValidTags = validEditTags(tagsTA.value, "tagsError");

        if (isValidTags) {
            try {
                await model.updateTag(
                    this.props.tid,
                    tagsTA.value)
                await model.updateModel();
                this.props.onEditTagClick(USER_PROFILE_PAGE);
            } catch (e) {
                alert("edit tag failed")
            }
        }
    }

    render() {
        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <h2>Tags*</h2>
                        <p>Add keyword (10 characters maximum)</p>
                        <textarea id="ask-question-tags" rows="4" cols="50" defaultValue={this.tagNames || ''} placeholder="Your Answer..." required></textarea>
                        <p id="tagsError" style={{ color: "red" }}></p>

                        <button className="post-question-answer-container-button"
                            onClick={() => this.handleEditTagClick()}>
                            Edit Tag
                        </button>
                    </div>
                </div>
                <p style={{ color: 'red', textAlign: 'right' }}>*indicates mandatory fields</p>
            </div>
        );
    }
}