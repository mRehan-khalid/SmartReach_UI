import { Routes } from '@angular/router';

export const CAMPAIGN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'pending',
    pathMatch: 'full'
  },
  {
    path: 'pending',
    loadComponent: () =>
      import('./pending-list/pending-list.component')
        .then(m => m.PendingListComponent)
  },
  {
    path: 'sent',
    loadComponent: () =>
      import('./sent-emails-list/sent-emails-list.component')
        .then(m => m.SentEmailsListComponent)
  },
  {
    path: 'followUp',
    loadComponent: () =>
      import('./follow-up-list/follow-up-list.component')
        .then(m => m.FollowUpListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-campaign/add-campaign.component')
        .then(m => m.AddCampaignComponent)
  }
];