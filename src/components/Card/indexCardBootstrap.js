//import Styles from "./Card.module.css";

export function Card(props) {
  return (
    <div class="row row-cols-2 row-cols-md-2 g-4">
      <div class="col">
        <div class="card text-center">
          <div class="card-header">{props.total}</div>
          {props.children}
          
        </div>
      </div>        
    </div>
  );
}


