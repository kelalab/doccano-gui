import React from 'react';
import { Box, Heading, Text } from 'grommet';
import { Checkmark } from 'grommet-icons';
import SquareButton from './SquareButton';
import { useTranslation } from 'react-i18next';

const Commands = ({
  labels,
  currentSentence,
  item,
  position,
  colorAlpha,
  commands,
  onLabelClick,
  labeling,
  cmdRows,
  guideLine,
}) => {
  const bottom = position === 'bottom';
  const { t } = useTranslation();

  let labelTips = [];
  if (guideLine && guideLine.Luokat) {
    labelTips = guideLine.Luokat;
  }
  console.log('labelTips', labelTips);
  let currentSelectedSentence;
  if (item) {
    currentSelectedSentence = item[currentSentence];
    console.log(currentSelectedSentence);
  }
  let itemLabels;
  if (currentSelectedSentence) {
    itemLabels = currentSelectedSentence.labels;
    console.log('itemLabels', itemLabels);
  }
  return (
    <Box
      elevation="medium"
      flex={{ shrink: 0 }}
      direction={bottom ? 'row' : 'column'}
      gap={bottom ? 'medium' : 'auto'}
      justify="between"
      wrap={true}
      pad="medium"
    >
      {labeling && (
        <Box fill="horizontal" align="center">
          <Heading margin="small" level={4}>
            Luokat
          </Heading>
          <Box
            direction={bottom ? 'row' : 'column'}
            wrap
            alignContent="around"
            justify="evenly"
            fill="horizontal"
          >
            {labels.map((l, idx) => (
              <Box
                key={'label' + idx}
                direction="row"
                margin={{ vertical: 'small' }}
              >
                <SquareButton
                  primary
                  size="small"
                  color={l.background_color + colorAlpha}
                  onClick={() => onLabelClick(l)}
                  label={
                    <Box
                      direction="row"
                      justify="between"
                      align="center"
                      gap="xsmall"
                    >
                      <Text size="small">{l.text}</Text>
                      <Box
                        background="rgba(0,0,0,.1)"
                        border="all"
                        round="xlarge"
                        pad={{ horizontal: 'small' }}
                      >
                        <Text size="small">{l.suffix_key}</Text>
                      </Box>
                    </Box>
                  }
                  icon={
                    itemLabels &&
                    itemLabels.indexOf(Number.parseInt(l.id)) !== -1 ? (
                      <Checkmark
                        size={'18px'}
                        strokeWidth={'large'}
                        color={colorAlpha ? 'black' : 'white'}
                      />
                    ) : undefined
                  }
                  tip={labelTips[l.text] ? labelTips[l.text] : t('noinstructions')}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box fill="horizontal" align="center">
        <Heading level={4} margin="medium">
          {t('navigation')}
        </Heading>
        <Box
          direction={bottom ? 'row' : 'column'}
          justify={bottom ? 'center' : 'evenly'}
          alignContent="around"
          wrap
          fill="horizontal"
        >
          {commands.map((cmd, idx) => {
            return (
              <Box
                margin={{ vertical: 'small', horizontal: 'small' }}
                fill={cmd.row === 0 && 'horizontal'}
                key={'cmd' + idx}
              >
                <SquareButton
                  disabled={cmd.disabled}
                  label={cmd.label}
                  icon={cmd.icon ? cmd.icon : undefined}
                  onClick={cmd.onClick}
                  reverse
                  margin="auto"
                  size="small"
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Commands;
