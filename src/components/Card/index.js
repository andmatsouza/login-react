//import Styles from "./Card.module.css";

export function Card(props) {
  return (     
    <div className={props.stilo}>
    <div className="div-head">
    {/*<span className={props.icon}></span>*/}
    <span>{props.total}</span>
    </div>    
    {props.children}
    </div>
  );
}