import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { CityCombobox } from '#/components/city-combobox.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/select-city',
  component: SelectCityPage,
})

function SelectCityPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select your city</CardTitle>
          <CardDescription>
            Search for a city and save it to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CityCombobox
            panelClassName="right-0 w-auto"
            renderTrigger={({ isOpen, searchTerm }) => (
              <span className="flex h-9 w-full items-center justify-between rounded-md border bg-background px-4 py-2 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground">
                <span className="truncate">
                  {searchTerm.trim() ? searchTerm.trim() : 'Choose a city'}
                </span>
                <span
                  className={`text-muted-foreground transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  ⌄
                </span>
              </span>
            )}
          />
        </CardContent>
      </Card>
    </main>
  )
}
