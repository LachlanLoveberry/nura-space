import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useCitySearchQuery } from '#/lib/state/cities'
import { useSelectedCityMutation } from '#/lib/state/user'
import type { CityPayload } from '#/lib/api/user'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

type RenderTriggerState = {
  isOpen: boolean
  searchTerm: string
}

export function CityCombobox({
  renderTrigger,
  triggerClassName,
  panelClassName,
  placeholder = 'Sydney',
  onSelected,
}: {
  renderTrigger: (state: RenderTriggerState) => React.ReactNode
  triggerClassName?: string
  panelClassName?: string
  placeholder?: string
  onSelected?: (city: CityPayload) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const citySearch = useCitySearchQuery(deferredSearchTerm)
  const saveCityMutation = useSelectedCityMutation()
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const results = citySearch.data ?? []

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        isOpen &&
        popoverRef.current &&
        event.target instanceof Node &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={cn('cursor-pointer outline-none', triggerClassName)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {renderTrigger({ isOpen, searchTerm })}
      </button>

      {isOpen ? (
        <div
          className={cn(
            'absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg',
            panelClassName
          )}
        >
          <div className="space-y-3">
            <Input
              type="search"
              value={searchTerm}
              placeholder={placeholder}
              autoFocus
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="max-h-72 space-y-1 overflow-auto">
              {deferredSearchTerm.trim().length >= 2 ? (
                results.length ? (
                  results.map((city) => {
                    const busy =
                      saveCityMutation.isPending &&
                      saveCityMutation.variables?.name === city.name &&
                      saveCityMutation.variables?.longitude === city.longitude &&
                      saveCityMutation.variables?.latitude === city.latitude

                    return (
                      <Button
                        key={`${city.name}-${city.latitude}-${city.longitude}`}
                        type="button"
                        variant="ghost"
                        className="h-auto w-full justify-start px-3 py-2 text-left"
                        onClick={() => {
                          const payload: CityPayload = {
                            name: city.name,
                            latitude: city.latitude,
                            longitude: city.longitude,
                          }
                          saveCityMutation.mutate(payload, {
                            onSuccess: () => {
                              setIsOpen(false)
                              setSearchTerm('')
                              onSelected?.(payload)
                            },
                          })
                        }}
                      >
                        <span className="flex w-full items-center justify-between gap-3">
                          <span className="flex items-center gap-2 truncate">
                            <span className="font-medium">{city.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {city.country ?? 'Unknown country'}
                            </span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {busy ? 'Saving...' : 'Select'}
                          </span>
                        </span>
                      </Button>
                    )
                  })
                ) : (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    No results found.
                  </p>
                )
              ) : (
                <p className="px-2 py-3 text-sm text-muted-foreground">
                  Type at least 2 letters to search.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {saveCityMutation.isError ? (
        <p className="mt-2 text-sm text-destructive">
          {(saveCityMutation.error as Error).message}
        </p>
      ) : null}
    </div>
  )
}
