import styles from './newColumn.module.scss'

export default function NewColumn() {

  return (
    <div className={`new-column ${styles.container}`}>
      <span className='heading-l'>+ New Column</span>
    </div>
  )
}
