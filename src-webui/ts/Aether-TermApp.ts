

import Vue from 'types/vue/vue'
// <reference path="types/systemjs/systemjs.d.ts" />
// <reference path="types/jquery/jquery.d.ts" />
// <reference path="types/foundation-sites/Foundation-Sites.d.ts" />

// import {CodeMirror} from './types/codemirror/codemirror';


export namespace Aether
{
	export class TermApp
	{
		//public EventMgr;
		private oExplorationMap: ExplorationMap;
		//TerminalOptions
		public constructor()
		{
			//basic configuration of this app's modules
			this.oExplorationMap=new ExplorationMap;
		}
		public onPageLoadBegin()
		{
			//@todo: init aptv dom tree
			console.log('onPageLoadBegin_in');
			console.log('onPageLoadBegin_out');
		}
		public onPageLoadEnd()
		{
			console.log('onPageLoadEnd_in');


			console.log('onPageLoadEnd_out');
		}

		//--- UtilityFunctions
		/**
		 * callServer
		 */
		public static callServer(sBase: string, sMeth: string, oData: object,
						  hSucessFunction?: (serverReturn: any) => void,
						  hFailFunction?: (oErrXHR: object) => void,
						  isAsync: boolean=true)
		{
			let sJxDomain='api';
			let returnValue;
			let oRpcCallParams=
			{
				type: 'post',
				url: sJxDomain+"/"+sBase+"/"+sMeth,
				data: oData,
				dataType: "json",
				success: hSucessFunction,
				error: hFailFunction
			};
			let oXHReq = new XMLHttpRequest();
			oXHReq.open(oRpcCallParams.type, oRpcCallParams.url, isAsync);
			oXHReq.onload=()=>
			{
				console.log(oXHReq);
				if (oXHReq.status >= 200 && oXHReq.status < 400)
				{
					returnValue=oXHReq.response;
					oRpcCallParams.success(JSON.parse(oXHReq.response));
				}
				else
				{
					if(hFailFunction)
					{
						oRpcCallParams.error(oXHReq);
					}
					else
					{
						console.log('An error was detected while sending XHR for '+sBase+'::'+sMeth+'(); '+oXHReq.status.toString()+":"+oXHReq.statusText);
					}
				}
			}
			oXHReq.onerror=hFailFunction;
			try
			{
				// $.ajax(oRpcCallParams);
				oXHReq.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				oXHReq.send(JSON.stringify(oRpcCallParams.data));
			}
			catch(e)
			{
				console.log('App exception while sending XHR for '+sBase+'::'+sMeth+', follows:');
				console.log(e);
				return false;
			}
			return returnValue;
		}

		//--- Appland
		/**
		 * getExplorationMap
		 * returns ExplorationMap component
		 */
		public getExplorationMap()
		{
			return this.oExplorationMap;
		}
		/**
		 * startExplorationMap
		 */
		public startExplorationMap(sSelector?: string, oOptions?: any)
		{
		}
	}

	export class ExplorationMap
	{
		/**
		 * constructor
		 */
		public constructor()
		{}


	}
}

interface TerminalOptions
{
	dimensions: any[];
	nodeData: any[];
}

declare const window: any;
window.Aesh = Aether.TermApp;