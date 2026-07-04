import { describe, expect, it } from 'vitest'
import {
  MAX_USER_INPUT_LENGTH,
  parseModuleId,
  sanitizeText,
  travelerProfileSchema,
} from './validation'

describe('sanitizeText', () => {
  it('strips control characters and trims', () => {
    expect(sanitizeText('  hello\u0007world  ')).toBe('helloworld')
  })

  it('caps length', () => {
    const long = 'a'.repeat(MAX_USER_INPUT_LENGTH + 100)
    expect(sanitizeText(long).length).toBe(MAX_USER_INPUT_LENGTH)
  })
})

describe('parseModuleId', () => {
  it('accepts valid module ids', () => {
    expect(parseModuleId('DASHBOARD')).toBe('DASHBOARD')
    expect(parseModuleId('LOCAL_GUIDE')).toBe('LOCAL_GUIDE')
  })

  it('rejects invalid values', () => {
    expect(parseModuleId('INVALID')).toBeNull()
    expect(parseModuleId(null)).toBeNull()
  })
})

describe('travelerProfileSchema', () => {
  it('validates a complete profile', () => {
    const result = travelerProfileSchema.safeParse({
      destination: 'Kyoto',
      startDate: '2026-07-01',
      endDate: '2026-07-05',
      interests: 'History',
      groupType: 'couple',
      budgetLevel: 'moderate',
      pace: 'moderate',
      dietaryRestrictions: '',
      accessibilityNeeds: '',
      languageSpoken: 'English',
      currentLocation: '',
    })
    expect(result.success).toBe(true)
  })
})
