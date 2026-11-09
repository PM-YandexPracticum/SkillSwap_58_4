import styles from './ErrorPage.module.css'

export interface ErrorPageProps {
  errorImage: string
  title: string
  description: string
  errorType: '500' | '404'
}

const chooseAlt = (errorType: ErrorPageProps['errorType']): string => {
  switch (errorType) {
    case '500':
      return 'Монитор с надписью 500 SERVER ERROR'
    case '404':
      return 'Монитор с надписью 404 ERROR'
  }
}

export function ErrorPage(_props: ErrorPageProps) {
  return (
    <>
      <img
        className={styles.image}
        src={_props.errorImage}
        alt={chooseAlt(_props.errorType)}
        width={460}
        height={304}
      />
      <div className={styles.text}>
        <h1 className={styles.title}>{_props.title}</h1>
        <p className={styles.description}>{_props.description}</p>
      </div>
    </>
  )
}
