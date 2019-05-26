import { OnInit } from '@angular/core';

import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {
  resources: T[];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService
      .getAll()
      .subscribe(
        resources => (this.resources = resources.sort((a, b) => b.id - a.id)),
        error => alert('Erro ao carregar a lista')
      );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm(this.mustDeleteMessage());
    if (mustDelete) {
      this.resourceService
        .delete(resource.id)
        .subscribe(
          () => (this.resources = this.resources.filter(element => element != resource)),
          () => alert('Erro ao tentar excluir')
        );
    }
  }

  mustDeleteMessage(): string {
    return 'Deseja realmente excluir este item ?'
  }
}
