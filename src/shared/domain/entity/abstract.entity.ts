import { EntityIdValueObject } from '../value-object/entity-id.value-object';

interface EntityProps {
  id: EntityIdValueObject;
  createdAt: Date;
  updatedAt: Date;
}

export class AbstractEntity<T extends EntityProps> {
  protected props: T;

  public get id(): EntityIdValueObject {
    return this.props.id;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  constructor(props: T) {
    this.props = props;
  }

  protected markAsUpdated(): void {
    this.props.updatedAt = new Date();
  }
}
