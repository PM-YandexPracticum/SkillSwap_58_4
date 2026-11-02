import styles from './Tag.module.css';

export type TagColor =
  | 'business' 
  | 'creativity' 
  | 'languages'
  | 'education' 
  | 'health' 
  | 'home' 
  | 'more';

const CATEGORY_COLOR_VAR: Record<TagColor, string> = {
  business:   'var(--color-tag-business)',
  creativity: 'var(--color-tag-art)',
  languages:  'var(--color-tag-language)',
  education:  'var(--color-tag-education)',
  health:     'var(--color-tag-health)',
  home:       'var(--color-tag-home)',
  more:       'var(--color-tag-more)',
};

export interface TagProps {
  label: string;
  /** Семантический цвет, приходит снаружи */
  color?: TagColor;
  /** Есть — показываем крестик, по клику плашка удаляется */
  onRemove?: () => void;
}

export function Tag({ label, color, onRemove }: TagProps) {
  return (
    <div 
      className={styles.tag} 
      style={{ backgroundColor: color ? CATEGORY_COLOR_VAR[color] : undefined }}
    >
      <span>{label}</span>
      
      {onRemove && (
        <button 
          type="button" 
          className={styles.removeButton} 
          onClick={onRemove}
          aria-label={`Удалить фильтр ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}