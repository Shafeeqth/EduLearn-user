import IUUIDService from '@/application/services/uuid.service';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export default class UUIDServiceImpl implements IUUIDService {
  public generate(): string {
    return uuidv4();
  }
}
