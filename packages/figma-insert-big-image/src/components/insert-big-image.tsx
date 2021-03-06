/** @jsx h */
import {
  Checkbox,
  Container,
  FileUploadButton,
  FileUploadDropzone,
  Text,
  useForm,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback } from 'preact/hooks'

import { computeDimensions } from '../utilities/compute-dimensions'
import { createImageElementFromFileAsync } from '../utilities/create-image-element-from-file-async'
import { splitImageElementAsync } from '../utilities/split-image-element-async'
import { trimExtension } from '../utilities/trim-extension'
import { Loading } from './loading/loading'

export function InsertBigImage(props: { [key: string]: any }): h.JSX.Element {
  const { state, handleChange } = useForm(
    {
      ...props,
      currentIndex: -1,
      total: 0
    },
    {
      onClose: function () {
        emit('CLOSE_UI')
      },
      transform: function (state) {
        const { total } = state
        return {
          ...state,
          isLoading: total > 0
        }
      }
    }
  )
  const { currentIndex, total, insertAs2x, isLoading } = state
  const handleSelectedFiles = useCallback(
    async function (files: Array<File>) {
      const total = files.length
      handleChange({ total })
      let currentIndex = 0
      for (const file of files) {
        currentIndex++
        handleChange({ currentIndex })
        const image = await createImageElementFromFileAsync(file)
        const widths = computeDimensions(image.width)
        const heights = computeDimensions(image.height)
        const images = await splitImageElementAsync(image, widths, heights)
        const name = trimExtension(file.name)
        emit('INSERT_BIG_IMAGE', {
          images,
          insertAs2x,
          isDone: currentIndex === total,
          name,
          width: image.width
        })
      }
    },
    [handleChange, insertAs2x]
  )
  if (isLoading === true) {
    return (
      <Loading>
        {total === 1
          ? 'Uploading image…'
          : `Uploading image ${currentIndex} of ${total}…`}
      </Loading>
    )
  }
  const acceptedFileTypes = ['image/png', 'image/jpeg']
  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <FileUploadDropzone
        acceptedFileTypes={acceptedFileTypes}
        multiple
        onSelectedFiles={handleSelectedFiles as any} // FIXME
      >
        <Text align="center" bold>
          Drop image files here
        </Text>
        <VerticalSpace space="small" />
        <Text align="center" muted>
          or
        </Text>
        <VerticalSpace space="small" />
        <FileUploadButton
          acceptedFileTypes={acceptedFileTypes}
          disabled={isLoading === true}
          focused // FIXME
          loading={isLoading === true}
          multiple
          onSelectedFiles={handleSelectedFiles as any}
        >
          Choose Image Files
        </FileUploadButton>
        <VerticalSpace space="medium" />
        <Text align="center" muted>
          Supported formats: JPEG, PNG
        </Text>
      </FileUploadDropzone>
      <VerticalSpace space="medium" />
      <Checkbox
        disabled={isLoading === true}
        name="insertAs2x"
        onChange={handleChange}
        value={insertAs2x === true}
      >
        <Text>Insert as a @2x image</Text>
      </Checkbox>
    </Container>
  )
}
