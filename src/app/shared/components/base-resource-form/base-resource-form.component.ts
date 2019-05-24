import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import toastr from 'toastr';
import { switchMap } from 'rxjs/operators';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel>
  implements OnInit, AfterContentChecked {
  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  protected route: ActivatedRoute
  protected router: Router
  protected formBuilder: FormBuilder

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
    this.route = this.injector.get(ActivatedRoute)
    this.router = this.injector.get(Router)
    this.formBuilder = this.injector.get(FormBuilder)
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      // save
      this.createResource();
    } else {
      //edit
      this.updateResource();
    }
  }

  // PRIVATE METHODS

  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource() {
    if (this.currentAction === 'edit') {
      this.route.paramMap
        .pipe(switchMap(params => this.resourceService.getById(+params.get('id'))))
        .subscribe(
          resource => {
            this.resource = resource;
            this.resourceForm.patchValue(resource); //bind loaded resource data to ResourceForm
          },
          err => alert('Ocorreu um erro no servidor, tente mais tarde')
        );
    }
  }

  protected setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = this.creationPageTitle()
    } else {
      this.pageTitle = this.editionPageTitle()
    }
  }

  protected creationPageTitle(): string {
    return 'Novo'
  }

  protected editionPageTitle(): string {
    return 'Edicao'
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.resourceService
      .create(resource)
      .subscribe(resource => this.actionsForSuccess(resource), err => this.actionsForError(err));
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.resourceService
      .update(resource)
      .subscribe(resource => this.actionsForSuccess(resource), err => this.actionsForError(err));
  }

  protected actionsForSuccess(resource: T) {
    toastr.success('Solicitacao solicitada com sucesso!');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path

    // redirect/reload component page
    this.router
      .navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']));
  }

  protected actionsForError(err: any) {
    toastr.error('Ocorreu um erro ao enviar sua solicitacao!');

    this.submittingForm = false;

    if (err.status === 422) {
      this.serverErrorMessages = JSON.parse(err._body).errors;
    } else {
      this.serverErrorMessages = [
        'Falha na comunicacao com o servidor, por favor tente mais tarde.'
      ];
    }
  }

  protected abstract buildResourceForm(): void
}