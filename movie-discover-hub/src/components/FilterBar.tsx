import { GENRES } from "@/types/movie";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  genre: string;
  onGenreChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
}

export default function FilterBar({ genre, onGenreChange, sortBy, onSortChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={genre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-[150px] rounded-xl border-border/50 bg-secondary text-sm">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {GENRES.map((g) => (
            <SelectItem key={g.id} value={String(g.id)}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[150px] rounded-xl border-border/50 bg-secondary text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity">Popularity</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="date">Release Date</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
