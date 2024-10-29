import { createMongoAbility } from '@casl/ability';
import { abilitiesPlugin } from '@casl/vue';

export default function (app) {
  const userAbilityRules = useCookie('userAbilityRules')
  
  // Log the contents of the cookie to check if rules are being loaded correctly
  console.log('User Ability Rules Cookie:', userAbilityRules.value);

  // Provide fallback/default rules if none are set in the cookie
  const defaultRules = [{ action: 'view', subject: 'Overview' }, { action: 'view', subject: 'Rewards' }, { action: 'view', subject: 'Project' }]; // Add any other default rules you need
  const initialAbility = createMongoAbility(userAbilityRules.value ?? defaultRules)

  console.log('User Ability Rules:', userAbilityRules.value)
  console.log('Initial Ability Rules:', initialAbility.rules);

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}

