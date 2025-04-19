````tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Product Manager",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "UX Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function PeopleGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {people.map((person) => (
        <Card
          key={person.email}
          className="relative border transition-all duration-100 hover:border-muted-foreground hover:shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 py-0"
        >
          <CardContent className="flex items-center space-x-4 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={person.imageUrl} alt={person.name} />
              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <a href="#" className="focus:outline-none">
                <span aria-hidden="true" className="absolute inset-0" />
                <p className="text-sm font-medium text-foreground">
                  {person.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {person.role}
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
````