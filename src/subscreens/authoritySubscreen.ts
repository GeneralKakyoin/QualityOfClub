import { InspectorSubscreen } from "./inspectorSubscreen";

export class AuthoritySubscreen extends InspectorSubscreen {
    constructor(target: Character | null = null) {
        super(target || (typeof Player !== "undefined" ? Player : null), "roles");
    }
}
