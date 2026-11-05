import { forwardRef, useId, useState } from 'react'
import EyeIcon from '@/shared/assets/icons/eye.svg?react'
import EyeOffIcon from '@/shared/assets/icons/eye-off.svg?react'
import { IconButton } from '@/shared/ui/IconButton'
import { Input, type InputProps } from '@/shared/ui/Input'
import styles from './PasswordInput.module.css'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon' | 'rightAction'> {
  /** Подсказка под полем, например «Пароль должен содержать не менее 8 знаков». Вместо неё при ошибке показывается `error` */
  hint?: string
}

/**
 * Поле пароля на основе `Input` с кнопкой-«глазом»: показать или скрыть пароль.
 * Под полем — подсказка (`hint`); если есть ошибка, показывается она, а подсказка скрывается.
 * Кнопка доступна с клавиатуры (Tab после поля), её подпись меняется: «Показать пароль» / «Скрыть пароль».
 * Ref передаётся на HTML-поле для react-hook-form.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548), ошибка (1:2627)
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ hint, error, 'aria-describedby': describedBy, ...props }, ref) {
    const [isVisible, setIsVisible] = useState(false)
    const hintId = useId()
    const showHint = Boolean(hint) && !error
    const description = [describedBy, showHint ? hintId : undefined].filter(Boolean).join(' ')

    return (
      <div className={styles.root}>
        <Input
          {...props}
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          error={error}
          aria-describedby={description || undefined}
          rightAction={
            <IconButton
              ariaLabel={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
              icon={<span className={styles.eye}>{isVisible ? <EyeOffIcon /> : <EyeIcon />}</span>}
              onClick={() => setIsVisible((visible) => !visible)}
            />
          }
        />
        {showHint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    )
  },
)
