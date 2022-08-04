//import Styles from "./Card.module.css";

export function Card(props) {
  return (     
    <div className={props.stilo}>
    <span className={props.icon}></span>
    <span>{props.total}</span>
    <span>{props.children}</span>
    </div>
  );
}