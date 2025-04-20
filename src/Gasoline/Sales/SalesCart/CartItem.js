// src/gasoline/Sales/SalesCart/CartItem.js
import React from 'react';
import { Button, ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function CartItem({ item, onRemove }) {
  return (
    <ListGroupItem className="d-flex justify-content-between align-items-center">
      <div>
        <strong>{item.producto}</strong><br />
        <small>{item.cantidad} - {item.monto}</small>
      </div>
      <Button color="danger" size="sm" onClick={() => onRemove(item.id)}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
    </ListGroupItem>
  );
}
