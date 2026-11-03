import styles from './Stepper.module.css'

export interface StepperProps {
  /** Текущий шаг регистрации, начиная с 1 */
  current: number
  /** Всего шагов - по макету регистрации 3 */
  total: number
}

/**
 * Индикатор шагов «Шаг 1 из 3» с полосками прогресса (регистрация).
 * Только отображает номер шага - переходами управляют страницы.
 *
 * @see Figma:
 * «Шаг 1 из 3» 1:2548, 1:2627;
 * «Шаг 2 из 3» 1:1497, 1:1541, 1:1585, 1:1629, 1:1673, 1:1717;
 * «Шаг 3 из 3» 1:1761
 */
export function Stepper({ current, total }: StepperProps) {
  // Номера шагов от 1 до total: индекс начинается с 0, поэтому index + 1
  // Для total = 3 получаем [1, 2, 3] — по полоске на каждый шаг
  const steps = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <div className={styles.stepper}>
      <p className={styles.title}>
        Шаг {current} из {total}
      </p>
      <div className={styles.lines}>
        {steps.map((step) => (
          <span
            key={step}
            data-testid="stepper-line"
            data-state={step <= current ? 'done' : 'todo'}
            className={step <= current ? styles.done : styles.todo}
          />
        ))}
      </div>
    </div>
  )
}
