import { OnStart, Service } from "@flamework/core";
import { createGUID } from "shared/utils/guid";

@Service()
export class ServerService implements OnStart {
    onStart(): void {
        print('Server ', createGUID(), ' ', DateTime.now())
    }
}