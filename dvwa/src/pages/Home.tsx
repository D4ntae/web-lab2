import { Card, CardHeader, CardContent} from '@/components/ui/card'

export const Home = () => {
    return (
    <div className="m-20 flex justify-center">
      <Card className="w-90 shadow-lg">
        <CardHeader>
          <p className="text-xl font-semibold">Dobrodošli u VRWA (Vrlo Ranjiva Web Aplikacija)</p>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Kod na ovoj stranici je namjerno ranjiv i moguće je isprobati dvije ranjivost: SQLi (SQL Injection) i CSRF (Cross Site Request Forgery).
          </p>
          <p className="text-slate-600">
            Kako biste isprobali ranjivost, pritisnite odgovarajući link na vrhu ekrana.
          </p>
        </CardContent>
      </Card>
    </div>
    )
}
