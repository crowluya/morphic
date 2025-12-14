'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { Check } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
]

export function LanguageMenuItems() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Get the path without the current locale prefix
    const segments = pathname.split('/')
    // Check if the first segment is a locale
    const currentLocaleInPath = languages.some(l => l.code === segments[1])

    let newPath: string
    if (currentLocaleInPath) {
      // Replace the locale in the path
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      // Add locale prefix
      newPath = `/${newLocale}${pathname}`
    }

    router.push(newPath)
    router.refresh()
  }

  return (
    <>
      {languages.map(lang => (
        <DropdownMenuItem
          key={lang.code}
          onClick={() => switchLocale(lang.code)}
          className="flex items-center justify-between"
        >
          <span>{lang.name}</span>
          {locale === lang.code && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      ))}
    </>
  )
}
