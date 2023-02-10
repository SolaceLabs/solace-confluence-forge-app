import ForgeUI, {
  MacroConfig,
  TextArea,
} from '@forge/ui';

export const Config = () => {
  return (
    <MacroConfig>
      <TextArea isRequired={true} placeholder="Enter text here" name="url" label="Solace Event Portal URL" />
    </MacroConfig>
  );
};