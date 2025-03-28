import { Controller, OnStart } from "@flamework/core";
import { createGUID } from "shared/utils/guid";

@Controller()
export class ClientController implements OnStart {
    onStart(): void {
        print('Client ', createGUID(), ' ', DateTime.now())
    }
}