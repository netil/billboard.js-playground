import * as _ from "lodash";
import { combineReducers } from "redux";
import { namespaceToObject, deepCopy } from "../util";
import { UPDATE_COMMAND, UPDATE_GUI } from "../actions";
import { initCommandConfigure, initDocumentConfigure, changeMemberProperty } from "../configure";

// 커맨드창
let commandState = {
	original: initCommandConfigure,
	text: JSON.stringify(initCommandConfigure)
};
// GUI 옵션
let guiState = initDocumentConfigure;


const updateCommandState = (state, updated) => {
	const original = deepCopy({}, state.original, deepCopy({}, updated));
	const text = JSON.stringify(original);

	return {
		original, text
	};
};

const updateGuiState = (state, updated) => {
	const newObj = changeMemberProperty(state, deepCopy({}, updated));
	return deepCopy({}, newObj);
};

const command = (state = commandState, action) => {
	let returnState;

	switch (action.type) {
		case UPDATE_GUI : {
			const conf = namespaceToObject(action.name.split("."), action.value);
			returnState = updateCommandState(state, conf);
			break;
		}
		case UPDATE_COMMAND :
			returnState = updateCommandState(state, action.value);
			break;
		default :
			returnState = state;
	}

	commandState = returnState;

	// react connect check shallow key
	returnState.lastUpdate = new Date();
	return returnState;
};

const gui = (state = guiState, action) => {
	let returnState = {};

	switch (action.type) {
		case UPDATE_GUI : {
			const value = namespaceToObject(action.name.split("."), action.value);
			returnState = updateGuiState(state, value);
			break;
		}
		case UPDATE_COMMAND :
			returnState = updateGuiState(state, action.value);
			break;
		default :
			returnState = state;
	}

	guiState = returnState;

	// react connect check shallow key
	returnState.lastUpdate = (new Date()).getTime();
	return returnState;
};

const playgroundApp = combineReducers({
	command, gui
});

export default playgroundApp;
