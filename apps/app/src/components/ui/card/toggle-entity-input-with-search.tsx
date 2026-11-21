// ./src/components/ui/card/toggle-entity-input-with-search.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
interface Entity {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}
interface ToggleEntityInputWithSearchProps {
  entities: Entity[];
  selectedEntities: Entity[];
  onSelect: (entity: Entity) => void;
  onRemove: (entity: Entity) => void;
  placeholder?: string;
  className?: string;
  maxSelections?: number;
}
const ToggleEntityInputWithSearch = ({
  entities,
  selectedEntities,
  onSelect,
  onRemove,
  placeholder = "Search entities...",
  className,
  maxSelections = Infinity,
}: ToggleEntityInputWithSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntities, setFilteredEntities] = useState(entities);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const filtered = entities.filter(
      (entity) =>
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedEntities.find((selected) => selected.id === entity.id)
    );
    setFilteredEntities(filtered);
  }, [searchQuery, entities, selectedEntities]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleInputFocus = () => {
    setIsOpen(true);
  };
  const handleEntitySelect = (entity: Entity) => {
    if (selectedEntities.length < maxSelections) {
      onSelect(entity);
      setSearchQuery("");
      inputRef.current?.focus();
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-md rounded-lg border bg-background",
        className
      )}
    >
      <div className="flex flex-wrap gap-2 p-2">
        {selectedEntities.map((entity) => (
          <motion.div
            key={entity.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
          >
            {entity.icon}
            <span>{entity.name}</span>
            <button
              onClick={() => onRemove(entity)}
              className="ml-1 rounded-full p-1 hover:bg-muted-foreground/20"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={
                selectedEntities.length >= maxSelections
                  ? "Maximum selections reached"
                  : placeholder
              }
              disabled={selectedEntities.length >= maxSelections}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && filteredEntities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-auto rounded-lg border bg-background shadow-lg"
          >
            {filteredEntities.map((entity) => (
              <motion.button
                key={entity.id}
                onClick={() => handleEntitySelect(entity)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-muted"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {entity.icon}
                <div>
                  <div className="font-medium">{entity.name}</div>
                  {entity.description && (
                    <div className="text-sm text-muted-foreground">
                      {entity.description}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export { ToggleEntityInputWithSearch };