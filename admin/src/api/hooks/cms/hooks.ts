'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { api } from '@/api/apiClient';
import { CMSEnum } from './key';
import { TCMSPayload, TCMSResponse } from './schema';

export const useGetHomeAssets = () => {
  return useQuery<TCMSResponse['getHomeAssets'], Error>({
    queryKey: [CMSEnum.homepage],
    queryFn: () => api.get<TCMSResponse['getHomeAssets']>(endpoints.cms.homepage),
  });
};

export const useCreateHomeAsset = () => {
  const queryClient = useQueryClient();

  return useMutation<TCMSResponse['createHomeAsset'], Error, TCMSPayload['createHomeAsset']>({
    mutationKey: [CMSEnum.createHomeAsset],
    mutationFn: (payload: TCMSPayload['createHomeAsset']) =>
      api.post<TCMSResponse['createHomeAsset']>(endpoints.cms.homepage, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CMSEnum.homepage] });
    },
  });
};
