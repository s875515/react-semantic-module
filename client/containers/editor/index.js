import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import style from './style.css';
import LightBox from 'client/components/lightbox';
//import html from 'doc/switches.md';
import {convertToHTML, convertFromHTML} from 'draft-convert';
//import { RadioGroup } from 'c_wap_module';
import Editor from 'client/components/editor';
import html from 'doc/editor.md';

import {
	convertToRaw,
	Entity
} from 'draft-js';

import $ from 'jquery';

import testData from './test.json';
import { fromJS } from 'immutable';

import mediaInfo from './mediaInfo.js'

let metion = [];
if(typeof(window) !== 'undefined'){
	$.each(testData.response, function(index,value){
		let item = {id:index, link: value.pid, name: value.userName, avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg'};
		metion.push(item);
	})
}

let convertPattern = {
	/* convert to HTML pattern */ 
	styleToHTML:{},
	blockToHTML:{
		'atomic':{
			start: '<figure>',
			end: '</figure>',
			empty: '<br>'
		},
		'blockquote':{
			start: '<blockquote>',
			end: '</blockquote>'
		}
	},
	entityToHTML: (entity, originalText) => {
		//console.log(entity);
		switch( entity.type ){
			case 'IMAGE':
			return `<img fileId="${entity.data.fileId}"/>`;
			case 'DOCUMENT':
			return `<div tagType="DOCUMENT" fileId="${entity.data.fileId}"></div>`;
			case 'HYPERLINK':
			return `<div tagType="HYPERLINK" fileId="${entity.data.fileId}" url="${entity.data.url}"></div>`;
			case 'YOUTUBE':
			return `<div tagType="YOUTUBE" file="${entity.data.file}" url="${entity.data.url}" src="${entity.data.src}"></div>`;
			case 'VIDEO':
			return `<video fileId="${entity.data.fileId}"/>`;
			case 'AUDIO':
			return `<audio fileId="${entity.data.fileId}"/>`;
			case 'mention':
			return `<div tagType="MEMBER" pid="${entity.data.mention.get('id')}">${entity.data.mention.get('name')}</div>`;
			case 'LINK':
			return `<a href="${entity.data.url}" target="_blank"></a>`;
			default:
			return originalText;
		}
	},
	/* convert from HTML pattern (如果沒用到就不必加)*/ 
	htmlToStyle: (nodeName, node, currentStyle) => {return currentStyle;},
	htmlToEntity: (nodeName, node) => {
		console.log(node);
		let data = {};
		if( typeof (node.attributes) !== 'undefined') {
			Array.prototype.slice.call(node.attributes).forEach(function(item){
				let name = item.name;
				if( name === 'fileid') name = 'fileId';
				else if( name === 'tagtype') name = 'tagType';

				data[name] = item.value;
			})
		}
		
		switch(nodeName){
			case 'img':
			return Entity.create('IMAGE','IMMUTABLE',data);
			case 'video':
			return Entity.create('VIDEO','IMMUTABLE',data);
			case 'audio':
			return Entity.create('AUDIO','IMMUTABLE',data);
			case 'a':
			return Entity.create('LINK','MUTABLE',data);
			case 'div':
			if ( node.getAttribute('tagtype') === 'MEMBER' ) return Entity.create(node.getAttribute('tagType'), 'SEGMENTED', data);
			else return Entity.create(node.getAttribute('tagtype'), 'IMMUTABLE', data);
		}
		
	},
	htmlToBlock: (nodeName, node) => {
        if (nodeName === 'blockquote') {
            return {
                type: 'blockquote',
                data: {}
            };
        }else if( nodeName === 'figure') {
			return {
				type: 'atomic',
				data: {}
			}
		}
    }
}




const mentions = fromJS(metion);

class EditorPage extends Component {
	constructor(){
		super();
		this.state = {
			open: false,
			rawStateString: null,
			HTMLString: null,
			rawState: null,
			uploadingCount: 0
		}
		this.onChange = (rawState) => this._onChange(rawState);
		this.toggle = () => this._toggle();
		this.onRequestSearch = (value) => this._onRequestSearch(value);
		this.open = () => this.setState({ open: true});
	}
	_onChange (contentState) {
		this.contentState = contentState;
		this.rawState= convertToRaw(contentState);
		//console.log(contentState);
		//console.log(this.rawState);
	}
	_toggle(){
		let html, htmlState;
		let fileStatus = this.refs.editor.getFileUploadObject();
		let uploadDone = true;
		for( var key in fileStatus ) {
			if( fileStatus[key].fileData.status !== 'uploadDone') {
				uploadDone = false;
			}
		}
		if( this.state.uploadingCount === 0 && uploadDone ){
			if( this.contentState ) {
				html = convertToHTML(convertPattern)(this.contentState);
				htmlState = convertFromHTML(convertPattern)(html);
			}
			this.setState({ 
				open: !this.state.open,
				rawStateString: JSON.stringify(this.rawState),
				rawState: this.rawState,
				HTMLString: html,
				HTMLtoState: convertToRaw(htmlState)
			});
			//console.log(this.refs.editor.getFileUploadObject());

		}
		
		
	}
	
	componentDidMount() {
		
	}
	onUploadStatusChange(object){
		console.log(Object.keys(object).length);
		this.setState({
			uploadingCount: Object.keys(object).length
		})
	}
	/*_onRequestSearch(value) {

	}*/
	render() {
		let option = {
			submit: {
				text: '完成',
				action: this.toggle
			},
			 closeIcon: true,
		}
		console.log(this.state.HTMLtoState);
		return (
			<div>
				<h3>Rich Editor</h3>
				<button styleName="viewButton" onClick={this.open}>發表文章</button>
				
				{ this.state.open && 
					<LightBox option={option}
						  onClose={this.toggle.bind(this,'close')}>
						<div styleName="editorBlock">
							<Editor apnum="10400"
									pid="10400"
									placeholder="welcome"
									onChange={this.onChange} 
									mentions={mentions}
									onUploadStatusChange={this.onUploadStatusChange.bind(this)}
									ref="editor"
									mediaInfo={mediaInfo}/>
						</div>
						{ this.state.uploadingCount > 0 && <div styleName="uploading">有{this.state.uploadingCount}個檔案上傳中...</div>}
					</LightBox>	
				}
				{ this.state.rawStateString &&
					<div>			
						<h3> SHOW JSON RESULT </h3>
						<div className="content">
							<p>{ this.state.rawStateString }</p>
						</div>
						<h3> Convert from JSON </h3>
						<h3> SHOW HTML RESULT </h3>
						<div className="content">
							<p>{ this.state.HTMLString }</p>
						</div>
						<h3> Convert from HTML </h3>
						<div className="content">
							<Editor content={this.state.HTMLtoState}
									apnum="10400"
									pid="10400"
									placeholder="welcome"
									onChange={this.onChange} 
									mentions={mentions}
									onUploadStatusChange={this.onUploadStatusChange.bind(this)}
									ref="editor"
									mediaInfo={mediaInfo}/>
						</div>
					</div>
				}
				<div className="content" dangerouslySetInnerHTML={{__html: html}}>
					
				</div>
			</div>
			
		);
	}
}

export default connect()(CSSModules(EditorPage,style,{allowMultiple:true}));