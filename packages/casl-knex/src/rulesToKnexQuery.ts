import { AnyAbility, Subject } from '@casl/ability';

interface RulesToKnexOptions {
  isRelation(field: string, subject: Subject, ability: AnyAbility): boolean
}

export function rulesToKnexQuery(ability: AnyAbility, action: string, subject: Subject, options: RulesToKnexOptions) {
  // TODO
}
