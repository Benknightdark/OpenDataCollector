import styles from '../../styles/Spinner.module.css'

export default function Spinner(props) {
  if (props.showLoading) {
    return (
      <div className={styles.loading}>Loading&#8230;</div>
    )
  } else {
    return <div></div>
  }

}