/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";


// client -> server
interface ServerEvents {
	reflex: {
		start: () => void;
	},
	placeCookableBurger(guid: string): void;
	giveCookedBurger(guid: string): void;
}

interface ServerFunctions { }

// server -> client
interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: () => void;
		start: () => void;
	};
	setVoidLighting: () => void;
	setRegularLighting: () => void;
	initExperience: (experience: number) => void;
	addExperience: (experience: number) => void;
}

interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
