// @flow
import { Node } from "prosemirror-model";
import { Step, StepResult } from "prosemirror-transform";

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
export default class SetDocAttrStep extends Step {
  key: string;
  prevValue: any = undefined;
  stepType: string;
  value: any;

  constructor(key: string, value: any, stepType = "SetDocAttr") {
    super();
    this.stepType = stepType;
    this.key = key;
    this.value = value;
  }
  apply(doc: Node) {
    this.prevValue = doc.attrs[this.key];
    doc.attrs[this.key] = this.value;
    return StepResult.ok(doc);
  }
  invert() {
    return new SetDocAttrStep(this.key, this.prevValue, "revertSetDocAttr");
  }
  map() {
    return null;
  }
  toJSON() {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value,
    };
  }
  static fromJSON(json: { [key: string]: any }) {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }
}
