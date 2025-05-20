import { optional } from 'inversify';

export default class GetAllUsersDto {
  @optional()
  page: number;

  @optional()
  pageSize: number;
}
