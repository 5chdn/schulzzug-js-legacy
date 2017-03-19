const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require('sinon');

describe('Test Cloud Functions', () => {
	var myFunctions, configStub, adminInitStub, functions, admin;

	before(() => {

	  admin =  require('firebase-admin');
	  adminInitStub = sinon.stub(admin, 'initializeApp');

	  functions = require('firebase-functions');
	  configStub = sinon.stub(functions, 'config').returns({
	      firebase: {
	        databaseURL: 'https://not-a-project.firebaseio.com',
	        storageBucket: 'not-a-project.appspot.com',
	      }
	    });
	  myFunctions = require('../index');
	});

	describe('updateTotalScore', () => {

	});

	describe('updateTotalDistance', () => {
		
	});

	after(() => {
	  configStub.restore();
	  adminInitStub.restore();
	});
});