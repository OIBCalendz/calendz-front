import { Validator } from 'vee-validate'

Validator.extend('email_valid_school', {
  validate: value => value.includes('@epsi.fr') || value.includes('@wis.fr') || value.includes('@ecoles-wis.net' || value.includes('@ecoles-wis.net'))
})

Validator.extend('contains_one_number', {
  validate: value => /\d/.test(value)
})

Validator.extend('contains_one_letter', {
  validate: value => /[a-zA-Z]/.test(value)
})

Validator.extend('valid_grade', {
  validate: value => [
    'SN1', 'SN2', 'B3', 'I1', 'I2', 'WIS1', 'WIS2', 'WIS3', 'WIS4', 'WIS5'
  ].indexOf(value) !== -1
})

Validator.extend('valid_group', {
  validate: value => [
    'G1', 'G2', 'G3',
    'G1 (dev)', 'G2 (dev)', 'G3 (dev)',
    'G1 (infra-réseau)', 'G2 (infra-réseau)', 'G3 (infra-réseau)',
    'G1 (ERP)', 'G2 (ERP)'
  ].indexOf(value) !== -1
})

Validator.extend('valid_city', {
  validate: value => [
    'Arras', 'Auxerre', 'Bordeaux', 'Brest',
    'Grenoble', 'Lille', 'Lyon', 'Montpellier',
    'Nantes', 'Paris', 'Rennes', 'Toulouse', 'Dakar'].indexOf(value) !== -1
})

Validator.extend('valid_task_type', {
  validate: value => ['homework', 'DS', 'task'].indexOf(value) !== -1
})

Validator.extend('boolean', {
  validate: value => ['true', 'false', true, false].includes(value)
})

Validator.extend('valid_role', {
  validate: value => ['ADMIN', 'MEMBER'].includes(value)
})
