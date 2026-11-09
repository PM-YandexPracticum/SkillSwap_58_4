import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { useClickOutside } from '@/shared/lib/hooks'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import styles from './Select.module.css'

export interface SelectProps {
  label?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string | null; label: string }>
  /** Управляемое значение; для выбора «Не указан» передайте вариант с value: null. */
  value: string | null
  onChange: (value: string | null) => void
  /** Поиск по подписи варианта. Кнопка «×» очищает запрос и выбранное значение. */
  searchable?: boolean
  error?: string
  disabled?: boolean
  /** Первоначально раскрытый список, например для Storybook. Игнорируется при disabled. */
  defaultOpen?: boolean
}

/**
 * Управляемый список с одним выбором, необязательным поиском и клавиатурной навигацией.
 * Не загружает данные и не управляет связью категории с подкатегорией.
 * @see Figma: «Регистрация 2 шаг» — «Пол» (1:1585), поиск «Город» (1:1629).
 */
export function Select({
  label,
  placeholder = 'Не указан',
  options,
  value,
  onChange,
  searchable = false,
  error,
  disabled = false,
  defaultOpen = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen && !disabled)
  const [activeValue, setActiveValue] = useState<string | null | undefined>()
  const [searchValue, setSearchValue] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const id = useId()
  const listboxId = `${id}-listbox`
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLocaleLowerCase().includes(searchValue.trim().toLocaleLowerCase()),
      )
    : options
  const activeIndex = filteredOptions.findIndex((option) => option.value === activeValue)
  const expanded = isOpen && !disabled
  const inputValue = expanded ? searchValue : (selectedOption?.label ?? '')
  const activeId = expanded && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveValue(undefined)
  }, [])

  useClickOutside(rootRef, close, expanded)

  useEffect(() => {
    if (disabled) close()
  }, [disabled, close])

  useEffect(() => {
    if (expanded && activeIndex >= 0) {
      listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [expanded, activeIndex, searchValue, options])

  const focusField = () => (searchable ? searchInputRef.current : triggerRef.current)?.focus()

  const open = (direction: 'first' | 'last' = 'first') => {
    if (disabled || (!searchable && options.length === 0)) return
    const selectedIndex = options.findIndex((option) => option.value === value)
    const index =
      selectedIndex >= 0 ? selectedIndex : direction === 'first' ? 0 : options.length - 1
    setSearchValue('')
    setActiveValue(options[index]?.value)
    setIsOpen(true)
  }

  const selectOption = (index: number) => {
    const option = filteredOptions[index]
    if (disabled || !option) return
    onChange(option.value)
    setSearchValue('')
    close()
    focusField()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (event.key === 'Escape' && expanded) {
      event.preventDefault()
      event.stopPropagation()
      close()
      focusField()
      return
    }
    // На кнопке очистки Enter и пробел должны сохранить обычное поведение кнопки.
    if (event.target !== triggerRef.current && event.target !== searchInputRef.current) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!expanded) {
        open(event.key === 'ArrowDown' ? 'first' : 'last')
      } else {
        const nextIndex =
          activeIndex < 0
            ? event.key === 'ArrowDown'
              ? 0
              : filteredOptions.length - 1
            : Math.max(
                0,
                Math.min(
                  filteredOptions.length - 1,
                  activeIndex + (event.key === 'ArrowDown' ? 1 : -1),
                ),
              )
        setActiveValue(filteredOptions[nextIndex]?.value)
      }
    } else if (event.key === 'Enter' || (!searchable && event.key === ' ')) {
      event.preventDefault()
      if (expanded) selectOption(activeIndex)
      else open()
    }
  }

  const fieldAria = {
    'aria-expanded': expanded,
    'aria-controls': expanded ? listboxId : undefined,
    'aria-activedescendant': activeId,
    'aria-labelledby': label ? labelId : undefined,
    'aria-label': label ? undefined : placeholder,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div
      ref={rootRef}
      className={[styles.root, expanded ? styles.rootOpen : ''].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close()
      }}
    >
      {label && (
        <label id={labelId} htmlFor={`${id}-trigger`} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <div className={styles.field}>
          {searchable ? (
            <Input
              {...fieldAria}
              ref={searchInputRef}
              id={`${id}-trigger`}
              role="combobox"
              aria-autocomplete="list"
              autoComplete="off"
              className={expanded ? styles.inputOpen : undefined}
              placeholder={placeholder}
              value={inputValue}
              disabled={disabled}
              onClick={() => {
                if (!expanded) open()
              }}
              onChange={(event) => {
                const query = event.target.value
                setSearchValue(query)
                setActiveValue(
                  options.find((option) =>
                    option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
                  )?.value,
                )
                setIsOpen(true)
              }}
              rightIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              rightAction={
                inputValue && !disabled ? (
                  <IconButton
                    ariaLabel="Очистить"
                    icon={<CrossIcon aria-hidden="true" />}
                    onClick={() => {
                      setSearchValue('')
                      setActiveValue(undefined)
                      setIsOpen(true)
                      onChange(null)
                      focusField()
                    }}
                  />
                ) : undefined
              }
            />
          ) : (
            <button
              {...fieldAria}
              ref={triggerRef}
              id={`${id}-trigger`}
              type="button"
              role="combobox"
              className={[
                styles.trigger,
                expanded ? styles.triggerOpen : '',
                error ? styles.triggerError : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={disabled}
              onClick={() => (expanded ? close() : open())}
            >
              <span className={selectedOption ? styles.value : styles.placeholder}>
                {selectedOption?.label ?? placeholder}
              </span>
              {expanded ? (
                <ChevronUpIcon className={styles.chevron} aria-hidden="true" />
              ) : (
                <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {expanded && (
          <div className={[styles.panel, error ? styles.panelError : ''].filter(Boolean).join(' ')}>
            <ul
              ref={listRef}
              id={listboxId}
              className={styles.options}
              role="listbox"
              aria-labelledby={label ? labelId : undefined}
              aria-label={!label ? placeholder : undefined}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={`${option.value ?? 'null'}-${index}`}
                  id={`${listboxId}-option-${index}`}
                  className={[styles.option, activeIndex === index ? styles.optionActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveValue(option.value)}
                  onClick={() => selectOption(index)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
