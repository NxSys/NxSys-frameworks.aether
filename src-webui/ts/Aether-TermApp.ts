


//Types
// <reference types="types/" />

//Includes
/// <reference path="ConsoleControl.ts" />


import Vue from 'types/vue/vue';
import Wampy from 'types/wampy/index';
// import {CodeMirror} from './types/codemirror/codemirror';

import ConsoleControl1 = ConsoleControl;

export class TermApp
{
	public static EventMgr: EventManager;
	//TerminalOptions
    private oUserProvidedConfig: TerminalOptions;
    public oCurrentConsoleSettings: ConsoleSettings;
    public static isDebugging: boolean;
    protected ServerHdlr: ServerHandler; 

	public constructor(aUserConfigData: { [key: string]: string })
	{
		// new ConsoleControl;
		ConsoleControl1.f('xxxx');
		//basic configuration of this app's modules
        this.oUserProvidedConfig=new TerminalOptions(aUserConfigData);
        // this.isDebugging=this.oUserProvidedConfig['debug'];
        TermApp.isDebugging=true;
        TermApp.EventMgr=new EventManager;
        this.ServerHdlr=new ServerHandler;
	}
    /**
     * For backend functionality only, do not affect the UI\DOM,
     * it's likely not ready yet!
     */
	public onPageLoadBegin()
	{
		//@todo: init aptv dom tree
		console.log('onPageLoadBegin_in');
        //throw up loading screen
        this.connect();
		console.log('onPageLoadBegin_out');
	}

    /**
     * Ok lets make sure the user can use the Console
     * @param oDomEvent
     */
	public onPageLoadEnd(oDomEvent: Event)
	{
		console.log('onPageLoadEnd_in');
        console.log(oDomEvent);
        //take down loading screen

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
				// oRpcCallParams.success(JSON.parse(oXHReq.response));
			}
			else
			{
				if(hFailFunction)
				{
					//oRpcCallParams.error(oXHReq);
				}
				else
				{
					console.log('An error was detected while sending XHR for '+sBase+'::'+sMeth+'(); '+oXHReq.status.toString()+":"+oXHReq.statusText);
				}
			}
		}
		// Type 'undefined' is not assignable to type '((this: XMLHttpRequest, ev: ProgressEvent) => any) | null'.
		// oXHReq.onerror=hFailFunction;
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

	public log(sMsg: string)
	{
		//use status line
	}

	//--- Appland

	public connect()
	{
		this.ServerHdlr.open(this.oUserProvidedConfig.sServerUrl, this.oUserProvidedConfig.sRealm);
	}

	protected sendMessage(sChannelName: string, sEventName: string, aData: Array<any>)
	{

	}
}

class ServerHandler
{
	public static readonly TOPIC_PREFIX='sh.aether.';
	private static oAcnWsConnection: Wampy.Wampy;
	public open(sServerUrl: string, sRealm: string)
	{
		ServerHandler.oAcnWsConnection=new Wampy(sServerUrl, {
			'realm': sRealm,
			'onError': () => {TermApp.EventMgr.addEvent(EventManager.TERMINAL_CHANNEL, new CustomEvent('GenericWampyError'));}
			});
	}
}

export class EventManager
{
    public static readonly TERMINAL_CHANNEL=0;
    public static readonly CONSOLE_CHANNEL =1;
    public aEventChannels: Array<EventTarget>;

    constructor()
    {
        this.aEventChannels=[]; //wat about that 0...?
        this.aEventChannels[EventManager.TERMINAL_CHANNEL]=new EventTarget;
    }

    /**
     * addEvent
     */
    public addEvent(iChannel: number, oEvent: CustomEvent)
    {
        if (TermApp.isDebugging)
        {
            console.log(oEvent+' emitted '+oEvent.type+' on channel '+iChannel);
            console.log(oEvent);
        }
        this.aEventChannels[iChannel].dispatchEvent(oEvent);
    }

	/*
     * addHandler
     *
     * @param iChannel
     * @param sEventName
     * @param hCallable
     * @param options
     */
    public addHandler(iChannel: number, sEventName: string, hCallable: EventListener|EventListenerObject, options?: object): void
    {
        if (TermApp.isDebugging)
        {
            monitorEvents(this.aEventChannels[iChannel], sEventName);
        }
        return this.aEventChannels[iChannel].addEventListener(sEventName, hCallable, options);
    }
}

export class TerminalOptions
{
     sServerUrl: string;
     sRealm: string;
 
    constructor(sJsonConfigData: { [key: string]: string })
    {
        //unserialize and populate
        this.assimilate(sJsonConfigData);
    }
 
    private assimilate(sJsonConfigData: { [key: string]: string })
    {
        console.log(sJsonConfigData);
        this.sServerUrl=sJsonConfigData['site.endpoint'];
        this.sRealm=sJsonConfigData['site.endpoint.realm'];
    }
}

interface ConsoleSettings
{}

// declare const window: any;
// window.Aesh = Aether;
//------------------------------------
function monitorEvents(EventTarget: EventTarget, string: string) {}
