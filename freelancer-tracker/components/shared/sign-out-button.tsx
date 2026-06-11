import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  return (
    <form action={logout} className="inline">
      <Button type="submit" size="sm" variant="outline">
        Sign out
      </Button>
    </form>
  )
}
