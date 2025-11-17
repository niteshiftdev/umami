'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Button,
  Modal,
  Dialog,
  DialogTrigger,
  AlertDialog,
  ConfirmationDialog,
  Heading,
  Text,
  TextField,
  FormField,
  FormButtons,
  Form,
  FormSubmitButton,
} from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';

export function ModalsShowcase() {
  const [confirmValue, setConfirmValue] = useState('');

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Basic Modal"
        description="Standard modal dialog"
        code={`<DialogTrigger>
  <Button>Open Modal</Button>
  <Modal placement="center">
    <Dialog title="Modal Title">
      Content goes here
    </Dialog>
  </Modal>
</DialogTrigger>`}
      >
        <Row gap="3" wrap="wrap">
          <DialogTrigger>
            <Button>Open Center Modal</Button>
            <Modal placement="center">
              <Dialog title="Modal Dialog">
                <Column gap="4">
                  <Text>This is a centered modal dialog with content.</Text>
                  <Row justifyContent="flex-end">
                    <Button>Close</Button>
                  </Row>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button variant="outline">Open Right Modal</Button>
            <Modal placement="right">
              <Dialog title="Side Panel">
                <Column gap="4">
                  <Text>This modal slides in from the right side.</Text>
                  <Text color="muted" size="3">
                    Perfect for settings panels or detail views.
                  </Text>
                  <Row justifyContent="flex-end">
                    <Button>Close</Button>
                  </Row>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button variant="outline">Open Bottom Modal</Button>
            <Modal placement="bottom">
              <Dialog title="Bottom Sheet">
                <Column gap="4">
                  <Text>This modal slides up from the bottom.</Text>
                  <Row justifyContent="flex-end">
                    <Button>Close</Button>
                  </Row>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Modal with Form"
        description="Modal containing a form"
        code={`<Modal placement="center">
  <Dialog title="Form Dialog">
    <Form onSubmit={handleSubmit}>
      <FormField name="name" label="Name">
        <TextField />
      </FormField>
      <FormButtons>
        <FormSubmitButton>Submit</FormSubmitButton>
      </FormButtons>
    </Form>
  </Dialog>
</Modal>`}
      >
        <DialogTrigger>
          <Button>Open Form Modal</Button>
          <Modal placement="center">
            <Dialog title="User Information">
              <Form onSubmit={data => alert(JSON.stringify(data, null, 2))}>
                <Column gap="4">
                  <FormField name="name" label="Name" rules={{ required: true }}>
                    <TextField placeholder="Enter your name" />
                  </FormField>

                  <FormField name="email" label="Email" rules={{ required: true }}>
                    <TextField placeholder="email@example.com" />
                  </FormField>

                  <FormButtons>
                    <Button variant="outline">Cancel</Button>
                    <FormSubmitButton>Save</FormSubmitButton>
                  </FormButtons>
                </Column>
              </Form>
            </Dialog>
          </Modal>
        </DialogTrigger>
      </ShowcaseSection>

      <ShowcaseSection
        title="Alert Dialog"
        description="Confirmation dialog with actions"
        code={`<AlertDialog
  title="Confirm Action"
  description="Are you sure?"
  confirmLabel="Confirm"
  cancelLabel="Cancel"
  onConfirm={handleConfirm}
/>`}
      >
        <Row gap="3" wrap="wrap">
          <DialogTrigger>
            <Button>Show Alert</Button>
            <Modal placement="center">
              <AlertDialog
                title="Confirm Action"
                description="Are you sure you want to proceed with this action?"
                confirmLabel="Yes, Continue"
                cancelLabel="Cancel"
                onConfirm={() => alert('Confirmed!')}
              />
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button variant="danger">Delete Item</Button>
            <Modal placement="center">
              <AlertDialog
                title="Delete Item"
                description="This action cannot be undone. Are you sure you want to delete this item?"
                isDanger
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={() => alert('Deleted!')}
              />
            </Modal>
          </DialogTrigger>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Confirmation Dialog"
        description="Dialog requiring typed confirmation"
        code={`<ConfirmationDialog
  value="DELETE"
  confirmMessage="Type DELETE to confirm"
  onConfirm={handleConfirm}
/>`}
      >
        <DialogTrigger>
          <Button variant="danger">Delete with Confirmation</Button>
          <Modal placement="center">
            <ConfirmationDialog
              title="Delete Resource"
              description="This will permanently delete the resource and cannot be undone."
              value="DELETE"
              confirmMessage={
                <Text>
                  Type <Text weight="bold">DELETE</Text> to confirm
                </Text>
              }
              isDanger
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={() => alert('Resource deleted!')}
            />
          </Modal>
        </DialogTrigger>
      </ShowcaseSection>

      <ShowcaseSection
        title="Modal Placements"
        description="All available modal placement options"
      >
        <Row gap="3" wrap="wrap">
          <DialogTrigger>
            <Button size="sm">Top</Button>
            <Modal placement="top">
              <Dialog title="Top Placement">
                <Column gap="4">
                  <Text>Modal positioned at the top</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button size="sm">Center</Button>
            <Modal placement="center">
              <Dialog title="Center Placement">
                <Column gap="4">
                  <Text>Modal positioned at the center</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button size="sm">Bottom</Button>
            <Modal placement="bottom">
              <Dialog title="Bottom Placement">
                <Column gap="4">
                  <Text>Modal positioned at the bottom</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button size="sm">Left</Button>
            <Modal placement="left">
              <Dialog title="Left Placement">
                <Column gap="4">
                  <Text>Modal positioned on the left</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button size="sm">Right</Button>
            <Modal placement="right">
              <Dialog title="Right Placement">
                <Column gap="4">
                  <Text>Modal positioned on the right</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>

          <DialogTrigger>
            <Button size="sm">Fullscreen</Button>
            <Modal placement="fullscreen">
              <Dialog title="Fullscreen">
                <Column gap="4">
                  <Text>Modal takes up the entire screen</Text>
                  <Button>Close</Button>
                </Column>
              </Dialog>
            </Modal>
          </DialogTrigger>
        </Row>
      </ShowcaseSection>
    </Column>
  );
}
