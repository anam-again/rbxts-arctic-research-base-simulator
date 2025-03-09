import { Controller, OnStart } from "@flamework/core";
import { createGUID } from "shared/utils/guid";

@Controller()
export class MyController implements OnStart {
    onStart(): void {
        print('Client ', createGUID())
    }
}